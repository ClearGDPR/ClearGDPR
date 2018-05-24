#!/bin/bash
set -e

echo

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname="$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE clear_gdpr_cg_controller_local;
    CREATE DATABASE clear_gdpr_cg_processor_local;
EOSQL