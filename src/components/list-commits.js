import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useQuery } from "@apollo/react-hooks";
import { get_commits } from "../services/queries";
import UserDetails from "./user-details";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const columns = [
  { id: "name", label: "Name", minWidth: 170 },

  {
    id: "message",
    label: "Message of the commit",
    minWidth: 170,
    align: "center",
  },
  {
    id: "commitedDate",
    label: "Date of the commit",
    minWidth: 170,
    align: "center",
  },

  {
    id: "oid",
    label: "Commit hash",
    minWidth: 170,
    align: "center",
    format: (value) => value.substr(0, 7),
  },
  {
    id: "parentoid",
    label: "Parent hash",
    minWidth: 170,
    align: "center",
    format: (value) => value.substr(0, 7),
  },
  {
    id: "detail",
    label: "Commit Details",
    minWidth: 170,
    align: "center",
    format: (value) => value.substr(0, 7),
  },
];

function createData(name, message, oid, commitedDate, parentoid, id) {
  return { name, message, oid, commitedDate, parentoid, id };
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 550,
  },
});
export default function ListCommits() {
  const classes = useStyles();

  const { loading, error, data, fetchMore } = useQuery(get_commits, {
    variables: { cursor: null },
  });

  const rows = [];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`Error: ${error.message}`}</p>;

  data.repository.object.history.edges.map((Commit) =>
    rows.push(
      createData(
        Commit.node.author.name,
        Commit.node.message,
        Commit.node.oid,
        Commit.node.committedDate,
        Commit.node.parents.edges.map((parentoid) =>
          parentoid.node.oid.substr(0, 7)
        ),
        Commit.node.author.user.id
      )
    )
  );

  return (
    <Paper className={classes.root}>
      <>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "name" ? (
                            <div>
                              {value}
                              <UserDetails id={row["id"]} />
                            </div>
                          ) : (
                            value
                          )}
                          {column.id === "detail" ? (
                            <div>
                              <Link
                                to={{
                                  pathname: "/" + row["oid"],
                                  data: {
                                    row,
                                  },
                                }}
                              >
                                <button type="button">Commit details</button>
                              </Link>
                            </div>
                          ) : (
                            ""
                          )}
                        </TableCell>
                      );
                    })}
                    <div></div>
                  </TableRow>
                );
              })}
              <div>
                {data.repository.object.history.pageInfo.hasNextPage && (
                  <Button
                    variant="contained"
                    color="primary"
                    align="center"
                    onClick={() => {
                      fetchMore({
                        variables: {
                          cursor:
                            data.repository.object.history.pageInfo.endCursor,
                        },
                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) {
                            return prev;
                          }
                          return {
                            repository: {
                              ...prev.repository,
                              object: {
                                ...prev.repository.object,
                                history: {
                                  ...fetchMoreResult.repository.object.history,
                                  edges: [
                                    ...prev.repository.object.history.edges,
                                    ...fetchMoreResult.repository.object.history
                                      .edges,
                                  ],
                                },
                              },
                            },
                          };
                        },
                      });
                    }}
                  >
                    Load More
                  </Button>
                )}
              </div>
            </TableBody>
          </Table>
        </TableContainer>
      </>
    </Paper>
  );
}
