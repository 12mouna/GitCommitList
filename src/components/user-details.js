import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { user_info } from "../services/queries";
import { useQuery } from "@apollo/react-hooks";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function UserDetails(props) {
  const UserId = props.id;

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { loading, data } = useQuery(user_info, {
    variables: {
      author: {
        id: UserId,
      },
    },
  });

  if (loading) return <p>Loading...</p>;

  const VerifyLocation = data.repository.object.history.edges.map(
    (loc) => loc.node.author.user.location
  );
  const VerifyEmail = data.repository.object.history.edges.map(
    (mail) => mail.node.author.user.email
  );
  const VerifyBio = data.repository.object.history.edges.map(
    (bio) => bio.node.author.user.bio
  );

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <List>
        <ListItem>
          <ListItemText
            primary="Bio"
            secondary={VerifyBio === "" ? "not mentioned" : VerifyBio}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Login"
            secondary={data.repository.object.history.edges.map(
              (e) => e.node.author.user.login
            )}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Location"
            secondary={VerifyLocation == "" ? "not mentioned" : VerifyLocation}
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Email"
            secondary={VerifyEmail == "" ? "not mentioned" : VerifyEmail}
          />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      <button type="button" onClick={() => handleOpen()}>
        User Info
      </button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
