# vercel-functions-example

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
create table todos (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  content text not null,
  createdAt timestamp default current_timestamp
);
```
