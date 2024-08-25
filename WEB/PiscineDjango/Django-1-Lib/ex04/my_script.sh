#!/bin/bash

REPO_DIR=$(dirname "$(realpath "$0")")
LOCAL_LIB="$REPO_DIR/django_venv"

if [ -d "$LOCAL_LIB" ]; then
    rm -rf "$LOCAL_LIB"
fi

virtualenv "$LOCAL_LIB" --always-copy
source "$LOCAL_LIB/bin/activate"

if [ -f requirement.txt ]; then
    pip install -r requirement.txt
fi