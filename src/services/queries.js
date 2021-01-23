import gql from "graphql-tag";

export const get_commits = gql`
  query($cursor: String) {
    repository(owner: "facebook", name: "react") {
      object(expression: "master") {
        ... on Commit {
          history(first: 10, after: $cursor) {
            pageInfo {
              endCursor
              hasNextPage
            }
            edges {
              cursor
              node {
                parents(first: 1) {
                  edges {
                    node {
                      oid
                    }
                  }
                }
                committedDate
                message
                oid
                author {
                  user {
                    id
                  }
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const user_info = gql`
  query($author: CommitAuthor) {
    repository(owner: "facebook", name: "react") {
      object(expression: "master") {
        ... on Commit {
          history(author: $author, first: 1) {
            edges {
              node {
                author {
                  user {
                    email
                    name
                    id
                    location
                    login
                    bio
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const commit_info = gql`
  query($oid: GitObjectID) {
    repository(owner: "facebook", name: "react") {
      object(expression: "master", oid: $oid) {
        ... on Commit {
          deletions
          additions
          changedFiles
          tree {
            entries {
              path
              name
            }
          }
        }
      }
    }
  }
`;
export default get_commits;
