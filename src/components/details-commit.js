import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { useQuery } from "@apollo/react-hooks";
import { commit_info } from "../services/queries";
import UserDetails from "./user-details";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",

    width: 800,

    backgroundColor: theme.palette.background.paper,

    border: "2px solid #000",

    boxShadow: theme.shadows[5],

    padding: theme.spacing(2, 4, 3),
  },
}));

export default function DetailCommit(props) {
  const commitdetails = props.location.data;

  const Classes = useStyles();

  const HashCommit = commitdetails.row.oid;

  const { loading, data } = useQuery(commit_info, {
    variables: { oid: HashCommit },
  });

  if (loading) return <p>Loading...</p>;
  console.log(data);
  return (
    <div className={Classes.paper}>
      <Link to="/">
        <Button>return to commit page</Button>
      </Link>

      <List>
        <ListItem>
          <ListItemText primary="Id" secondary={commitdetails.row.id} />
        </ListItem>

        <ListItem>
          <div>
            <ListItemText primary="Name" secondary={commitdetails.row.name} />

            <UserDetails id={commitdetails.row.id} />
          </div>
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Description"
            secondary={commitdetails.row.message}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Number Of Changed Files"
            secondary={data.repository.object.additions}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Number Of Deletions"
            secondary={data.repository.object.deletions}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Number Of Additions"
            secondary={data.repository.object.additions}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Hash Commit"
            secondary={commitdetails.row.oid}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Parent hash"
            secondary={commitdetails.row.parentoid["0"]}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Date Of Commit"
            secondary={commitdetails.row.commitedDate}
          />
        </ListItem>
      </List>
    </div>
  );
}
