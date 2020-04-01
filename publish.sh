#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'
trap 'echo "Aborting due to errexit on line $LINENO. Exit code: $?" >&2' ERR
readonly DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

###############################################################################
# Program Functions
###############################################################################

##DOC publish
task_publish() {
  npm run build
  (
    cd dist

    git add .
    git commit -am publish
    git push origin gh-pages
  )
}

###############################################################################
# Helper functions
###############################################################################

usage() {
  echo "Commands:"
  grep -e "^##DOC" < "$(basename "$0")" | sed "s/^##DOC \(.*\)/  \1/"

  exit 1
}

main() {
  CMD=${1:-}
  shift || true

  pushd "$DIR" > /dev/null

  if type "task_${CMD}" &> /dev/null; then
    "task_${CMD}" "$@"
  else
    usage
  fi

  popd > /dev/null
}

main "$@"