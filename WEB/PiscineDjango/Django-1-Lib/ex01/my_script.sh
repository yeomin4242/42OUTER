#!/bin/bash

# Set up variables
PYTHON_PATH="/usr/bin/python3"
REPO_DIR=$(dirname "$(realpath "$0")")
LOCAL_LIB="$REPO_DIR/local_lib"
LOG_FILE="$REPO_DIR/install.log"
SMALL_PROGRAM="my_program.py"

# Display pip version
PIP_VERSION=$("$PYTHON_PATH" -m pip --version)
echo "Using pip version: $PIP_VERSION"

# Remove existing path.py installation if it exists
if [ -d "$LOCAL_LIB" ]; then
    echo "Removing existing path.py installation..."
    rm -rf "$LOCAL_LIB"
fi

# Set up virtual environment
echo "Setting up virtual environment..."

virtualenv "$LOCAL_LIB" --always-copy
source "$LOCAL_LIB/bin/activate"

# Install path.py development version from GitHub repo
echo "Installing path.py development version to $LOCAL_LIB..."
pip install --log "$LOG_FILE" git+https://github.com/jaraco/path.git

# Check installation status
INSTALL_STATUS=$?
if [ $INSTALL_STATUS -eq 0 ]; then
    echo "path.py installed successfully."
    
    # Execute the my program
    echo "Executing the my program..."
    python3 "$REPO_DIR/$SMALL_PROGRAM"
else
    echo "Failed to install path.py. Check $LOG_FILE for details."
fi