BEGIN;
-- Remove risky policy that queries auth.users and causes permission denied
DROP POLICY IF EXISTS "Enable all access for admin email" ON public.user_roles;
COMMIT;