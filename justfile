[working-directory: 'backend']
reset-db:
  cargo db drop
  cargo db create
  cargo db migrate
  cargo db seed

[working-directory: 'backend']
be-test:
  cargo test

