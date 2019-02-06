Update Process
==============

Run the following query on https://developer.github.com/v4/explorer/:

```graphql
query {
  search(query:"org:projectfluent", type:REPOSITORY, first:20) {
    edges {
      node {
        ...on Repository {
          name
          stargazers(last: 100) {
            totalCount
            edges {
              starredAt
            }
          }
        }
      }
    }
  }
}
```

and save the result as `fluent-stars-result.json`.
