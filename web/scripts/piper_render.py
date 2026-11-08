"""Render Welsh lines with Piper. Called by local-tts.mjs.

stdin: JSON lines {"key", "text", "model", "speaker"} → writes <out>/<key>.wav.
Loads each voice model once.
"""

import json
import sys
import wave
from pathlib import Path

from piper import PiperVoice, SynthesisConfig

out = Path(sys.argv[1])
espeak = sys.argv[2]
length_scale = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
voices: dict[str, PiperVoice] = {}

for raw in sys.stdin:
    if not raw.strip():
        continue
    job = json.loads(raw)
    model = job["model"]
    if model not in voices:
        voices[model] = PiperVoice.load(model, espeak_data_dir=espeak)
    cfg = SynthesisConfig(speaker_id=job.get("speaker"), length_scale=length_scale)
    with wave.open(str(out / f"{job['key']}.wav"), "wb") as w:
        voices[model].synthesize_wav(job["text"], w, syn_config=cfg)
    print(job["key"], flush=True)
