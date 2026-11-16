#!/bin/sh
set -eu

storage_path="${APP_FILE_STORAGE_PATH:-/app/uploads}"
mkdir -p "$storage_path"
chown resolveit:resolveit "$storage_path"

exec su-exec resolveit java -jar /app/app.jar
