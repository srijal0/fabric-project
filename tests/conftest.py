import sys
import os
import atexit

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

# Point every test run at a fresh, throwaway SQLite file instead of a
# persistent one. This is what actually caused the "no such column:
# fabric.image_path" failures: a leftover .db file created *before* a
# model change (e.g. adding image_path) has an outdated schema, and
# SQLModel's create_all() only creates missing tables — it never adds
# columns to a table that already exists. A fresh file every run means
# a stale schema can never happen again, no matter what changes in
# models.py later.
#
# This must run before any test module imports database.py / main.py,
# since that's what reads DATABASE_URL and builds the engine. conftest.py
# is always loaded by pytest before test modules, so this is the right
# place for it.
TEST_DB_PATH = os.path.join(os.path.dirname(__file__), "_test_run.db")
if os.path.exists(TEST_DB_PATH):
    os.remove(TEST_DB_PATH)
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH}"


def _cleanup_test_db():
    if os.path.exists(TEST_DB_PATH):
        try:
            os.remove(TEST_DB_PATH)
        except OSError:
            pass  # best-effort; same Windows file-lock situation as uploads/ cleanup


atexit.register(_cleanup_test_db)