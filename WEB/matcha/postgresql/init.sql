-- init.sql
-- 데이터베이스가 이미 존재하는지 확인하고, 존재하지 않는 경우에만 생성
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_database WHERE datname = 'postgres'
    ) 
    THEN
        CREATE DATABASE "postgres";
    END IF;
END
$$;
