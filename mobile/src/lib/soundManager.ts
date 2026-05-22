import { Audio } from "expo-av";

type SoundName = "click" | "correct" | "wrong" | "winner";

const SOUND_SOURCES: Record<SoundName, number> = {
  click: require("../assets/sounds/click.mp3"),
  correct: require("../assets/sounds/correct.mp3"),
  wrong: require("../assets/sounds/wrong.mp3"),
  winner: require("../assets/sounds/winner.mp3"),
};

let loadedSounds: Partial<Record<SoundName, Audio.Sound>> = {};
let preloadPromise: Promise<void> | null = null;
let playbackQueue: Promise<void> = Promise.resolve();

async function stopSound(sound?: Audio.Sound) {
  if (!sound) {
    return;
  }

  try {
    const status = await sound.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      await sound.stopAsync();
    }
  } catch {
    // Ignore stale sound state.
  }
}

async function stopAllSounds() {
  await Promise.all(Object.values(loadedSounds).map((sound) => stopSound(sound)));
}

async function loadSound(name: SoundName) {
  const existing = loadedSounds[name];
  if (existing) {
    return existing;
  }

  const { sound } = await Audio.Sound.createAsync(SOUND_SOURCES[name], { shouldPlay: false });
  loadedSounds[name] = sound;
  return sound;
}

async function playSound(name: SoundName) {
  const sound = await loadSound(name);
  await stopAllSounds();
  await sound.replayAsync();
}

function enqueuePlay(name: SoundName) {
  playbackQueue = playbackQueue
    .then(() => playSound(name))
    .catch(() => {
      // Swallow sound errors so UI actions never fail because audio did.
    });

  return playbackQueue;
}

export async function preloadSounds() {
  if (!preloadPromise) {
    preloadPromise = (async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });

      await Promise.all(Object.keys(SOUND_SOURCES).map((name) => loadSound(name as SoundName)));
    })();
  }

  return preloadPromise;
}

export function unloadSounds() {
  const sounds = Object.values(loadedSounds);
  loadedSounds = {};
  preloadPromise = null;
  playbackQueue = Promise.resolve();

  return Promise.all(
    sounds.map(async (sound) => {
      if (!sound) {
        return;
      }

      try {
        await sound.unloadAsync();
      } catch {
        // Ignore unload errors during app shutdown.
      }
    })
  );
}

export function playClickSound() {
  return enqueuePlay("click");
}

export function playCorrectSound() {
  return enqueuePlay("correct");
}

export function playWrongSound() {
  return enqueuePlay("wrong");
}

export function playWinnerSound() {
  return enqueuePlay("winner");
}

export function withClickSound<TArgs extends unknown[], TResult>(handler: (...args: TArgs) => TResult) {
  return (...args: TArgs) => {
    void playClickSound();
    return handler(...args);
  };
}