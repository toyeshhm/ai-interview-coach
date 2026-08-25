-- answers.score was created as `integer`, but evaluateAnswer prompts the model
-- for a 1-10 score and the model can legitimately return a decimal (e.g. 7.5).
-- Postgres silently rounds those on insert, and sessions.overall_score — which
-- is already numeric(4,2) — then averages the rounded values.
--
-- Widening integer -> numeric(4,2) is lossless, so existing rows are unaffected.

alter table answers
  alter column score type numeric(4,2) using score::numeric(4,2);
