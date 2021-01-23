import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ListCommits from "./components/list-commits";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <div className="App">
      <Typography variant="h3" align="center" className={classes.title}>
        {" "}
        Commit List{" "}
      </Typography>
      <div>
        <ListCommits />
      </div>
    </div>
  );
};

export default App;
