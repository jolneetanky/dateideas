# external DB integration. We can use an ORM.
# connect to jobDB
import psycopg
from lib.db.base import DB
from lib.logger import initLogger

# TODO: refactor this class it's too messy
class PostgresDB(DB):

    def connect_db(self):
        print("Connecting to DB...") 
        conn = psycopg.connect(
            "dbname=jobdb user=jolene password=secret host=localhost port=5432"
        )

        self.conn = conn

    def reset_table(self, tableName: str):
        pass

    def setup_job_table(self):
        # Open a cursor to perform DB operations
        print("Setting up job table...")
        with self.conn.cursor() as cur:
            cur.execute("""
    CREATE TABLE IF NOT EXISTS jobs (
                        id UUID PRIMARY KEY,
                        status TEXT NOT NULL,
                        );
                        """)
            self.conn.commit()

    # insert a `jobId` into DB
    def insert_job(self, job_id, status):
        print("[POSTGRESJOBDB] inserting...")
        with self.conn.cursor() as cur:
            cur.execute(
                "INSERT INTO jobs (id, status) values (%s, %s)",
                (job_id, status)
            )
            self.conn.commit()
    
    def reset_jobs_table(self):
        with self.conn.cursor() as cur:
            cur.execute("""
                DROP TABLE IF EXISTS jobs;
                CREATE TABLE jobs (
                    id UUID PRIMARY KEY,
                    status TEXT
                );
            """)
            self.conn.commit()

    def update_job_status(self, job_id, new_status):
        with self.conn.cursor() as cur:
            cur.execute(
                "UPDATE jobs SET status = %s WHERE id = %s;",
                (new_status, job_id)
            )
        self.conn.commit() 

postgresJobDB = PostgresDB() # singleton

def initPostgresJobDB():
    postgresJobDB.connect_db()
    postgresJobDB.reset_jobs_table()
    # postgresJobDB.reset_table("jobs")