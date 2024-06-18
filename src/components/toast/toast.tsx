import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export type Severity = "success" | "error" | "warning" | "info";

type Position = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface AnchorOrigin {
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
}

interface ToastProps {
  message: string;
  type: Severity;
  position: Position;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Toast({ message, type, position, open, setOpen }: ToastProps): React.ReactElement {
  const [anchorOrigin, setAnchorOrigin] = React.useState<AnchorOrigin>({ vertical: 'top', horizontal: 'right' });

  const getPositionMapping = (positionInput: Position): AnchorOrigin => {
    switch (position) {
      case "top-left":
        return { vertical: "top", horizontal: "left" };
      case "top-right":
        return { vertical: "top", horizontal: "right" };
      case "bottom-left":
        return { vertical: "bottom", horizontal: "left" };
      case "bottom-right":
        return { vertical: "bottom", horizontal: "right" };
      default:
        // Handle any unexpected values or provide a default fallback
        throw new Error(`Unsupported position: ${positionInput}`);
    }
  };

  React.useEffect(() => {
    if (position) {
      const mappedOrigin = getPositionMapping(position);
      setAnchorOrigin(mappedOrigin);
    }
  }, [position]);

  return (
    <Snackbar
      autoHideDuration={6000}
      anchorOrigin={anchorOrigin}
      open={open}
      onClose={() => { setOpen(false); }}
    >
      <Alert
        onClose={() => { setOpen(false); }}
        severity={type}
        // variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
