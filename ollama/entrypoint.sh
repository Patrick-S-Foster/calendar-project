#!/bin/bash

/bin/ollama serve &
pid=$!
sleep 5
ollama pull gemma2:2b
wait $pid