
import { React, Component } from 'react';
import Snackbar from '@mui/material/Snackbar';

let openSnackbarFn;

class Notifier extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      message: '',
    };
  }

  componentDidMount() {
    openSnackbarFn = this.openSnackbar
  }

  openSnackbar = ({message}) => {
    this.setState({open: true,message});
  }

  handleSnackbarRequestClose = () => {
    this.setState({
      open: false,
      message: '',
    });
  }

  render(){
    const message = (
      <span id="snackbar-message-id" dangerouslySetInnerHTML={{ __html: this.state.message }} />
    );

    return (
      <Snackbar 
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={this.state.open}
        message={message}
        autoHideDuration={3000}
        onClose={this.handleSnackbarRequestClose}
        ContentProps={{'aria-describedby': 'snackbar-message-id'}}
      />
    );
  }
}

export function openSnackbarExported({ message }) {
  openSnackbarFn({ message });
}

export default Notifier;
