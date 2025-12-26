#!/usr/bin/env python
import os
import sys
import time
from urllib.parse import urlparse

import MySQLdb


def build_db_config():
    database_url = os.getenv("DATABASE_URL")
    if database_url and "${" in database_url:
        print("DATABASE_URL looks like an unresolved template, ignoring it.")
        database_url = None

    if database_url:
        url = urlparse(database_url)
        port = url.port if url.port else 3306
        db_name = url.path.lstrip("/") if url.path else "mysql"
        hostname = url.hostname or "localhost"
        db_config = {
            "host": hostname,
            "port": port,
            "user": url.username or "root",
            "passwd": url.password or "",
            "db": db_name,
        }
        return db_config, hostname

    db_host = os.getenv("DATABASE_HOST") or os.getenv("DB_HOST")
    if not db_host:
        return None, None

    db_port = os.getenv("DATABASE_PORT") or os.getenv("DB_PORT") or "3306"
    db_user = os.getenv("DATABASE_USER") or os.getenv("DB_USER") or "root"
    db_password = os.getenv("DATABASE_PASSWORD") or os.getenv("DB_PASSWORD") or ""
    db_name = os.getenv("DATABASE_NAME") or os.getenv("DB_NAME") or "mysql"

    db_config = {
        "host": db_host,
        "port": int(db_port),
        "user": db_user,
        "passwd": db_password,
        "db": db_name,
    }
    return db_config, db_host


def wait_for_db(max_retries=30, retry_delay=2):
    """
    Wait for database to be available.
    Supports both DATABASE_URL and DATABASE_* / DB_* variables.
    """
    db_config, hostname = build_db_config()
    if not db_config:
        print("No database configuration found, skipping database wait")
        return True

    print(
        "Waiting for database to be available "
        f"(max {max_retries} attempts, {retry_delay}s delay)..."
    )

    if "ondigitalocean.com" in (hostname or ""):
        db_config["ssl"] = {
            "key": None,
            "cert": None,
            "ca": None,
            "check_hostname": False,
            "ssl_verify_cert": False,
            "ssl_verify_identity": False,
        }
        print("Detected Digital Ocean database, SSL config enabled")

    print(f"Connecting to: {db_config['host']}:{db_config['port']}/{db_config['db']}")

    for attempt in range(max_retries):
        try:
            conn = MySQLdb.connect(**db_config)
            conn.close()
            print("OK: Database is available.")
            return True
        except MySQLdb.Error as e:
            if attempt < max_retries - 1:
                print(f"  Attempt {attempt + 1}/{max_retries}: {str(e)[:80]}...")
                time.sleep(retry_delay)
            else:
                print(f"ERROR: Failed to connect after {max_retries} attempts: {e}")
                return False

    return False


if __name__ == "__main__":
    success = wait_for_db()
    sys.exit(0 if success else 1)
