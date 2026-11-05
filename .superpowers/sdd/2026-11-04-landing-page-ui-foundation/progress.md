# SDD ledger — plan: C:\.Study at School\.Web Application Safety\TrangTuyenSinhEdu\docs\superpowers\plans\2026-11-04-landing-page-ui-foundation.md

Ruling: Work in the current `security-Web` branch because the user explicitly wants to inspect changes in the shared workspace; it is not main/master. Cost if wrong: changes are visible immediately instead of isolated in a worktree.
Ruling: The supplied SDD shell scripts cannot run because this Windows environment has no Bash/WSL; maintain the required ledger and task gates manually. Cost if wrong: task brief/package automation is unavailable, but test and Git evidence remain reproducible.
Pre-flight: Task 1 tokens/test harness are consumed by Tasks 2–5; names match the plan.
Pre-flight: Task 2 `useDismissibleLayer` is consumed by Task 4 with the same interface.
Pre-flight: Task 3 `LandingHero` is consumed by Task 5 through the existing `Hero` default export compatibility layer.
Pre-flight: Task 5 combines all earlier components and stable anchors; no interface conflict found.
