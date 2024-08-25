#!/bin/sh

if [ $# -ne 1 ]; then
    echo "Usage: $0 <bit.ly URL>"
    exit 1
fi

bitly_url="$1"

# Follow the bit.ly URL and extract the final destination URL
final_url=$(curl -sI "$bitly_url" | grep -i '^location' | cut -d' ' -f2)

if [ -z "$final_url" ]; then
    echo "Failed to retrieve the final URL from bit.ly"
    exit 1
fi

echo "$final_url"