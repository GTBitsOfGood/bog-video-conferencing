import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Button, Grid, InputLabel, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import { useAppState } from '../../../state';
import { useParams } from 'react-router-dom';
import { TwilioError } from 'twilio-video';

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1.5em 0 3.5em',
    '& div:not(:last-child)': {
      marginRight: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '1.5em 0 2em',
    },
  },
  textFieldContainer: {
    width: '100%',
  },
  continueButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

interface RoomNameScreenProps {
  name: string;
  roomName: string;
  setName: (name: string) => void;
  setRoomName: (roomName: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RoomNameScreen({ name, roomName, setName, setRoomName, handleSubmit }: RoomNameScreenProps) {
  const classes = useStyles();
  const { user, isValidRoom, setError } = useAppState();
  const { URLRoomName } = useParams();
  const [includeRoomNameField, setIncludeRoomNameField] = useState(false);

  const onSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const { valid, message } = await isValidRoom(roomName);
    if (valid) {
      handleSubmit(formEvent);
      return;
    }
    setError(new Error(message) as TwilioError);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  useEffect(() => {
    setIncludeRoomNameField(!URLRoomName);
  }, [URLRoomName]);

  const hasUsername = !window.location.search.includes('customIdentity=true') && user?.displayName;

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Join a Room
      </Typography>
      <Typography variant="body1">
        {hasUsername
          ? "Enter the name of a room you'd like to join."
          : "Enter your name and the name of a room you'd like to join"}
      </Typography>
      <form onSubmit={onSubmit}>
        <div className={classes.inputContainer}>
          {!hasUsername && (
            <div className={classes.textFieldContainer}>
              <InputLabel shrink htmlFor="input-user-name">
                Your Name
              </InputLabel>
              <TextField
                id="input-user-name"
                variant="outlined"
                fullWidth
                size="small"
                value={name}
                onChange={handleNameChange}
              />
            </div>
          )}
          {includeRoomNameField && (
            <div className={classes.textFieldContainer}>
              <InputLabel shrink htmlFor="input-room-name">
                Room Name
              </InputLabel>
              <TextField
                autoCapitalize="false"
                id="input-room-name"
                variant="outlined"
                fullWidth
                size="small"
                value={roomName}
                onChange={handleRoomNameChange}
              />
            </div>
          )}
        </div>
        <Grid container justify="flex-end">
          <Button
            variant="contained"
            type="submit"
            color="primary"
            disabled={!name || !roomName}
            className={classes.continueButton}
          >
            Continue
          </Button>
        </Grid>
      </form>
    </>
  );
}
