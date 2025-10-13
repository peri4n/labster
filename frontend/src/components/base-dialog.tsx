import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import type { DialogProps } from '@mui/material';
import type { ReactNode } from 'react';

interface BaseDialogProps extends Omit<DialogProps, 'title'> {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

function BaseDialog({ title, children, actions, ...dialogProps }: BaseDialogProps) {
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            boxShadow: (theme) => theme.shadows[12]
          }
        }
      }}
      {...dialogProps}
    >
      <DialogTitle
        sx={{
          pb: 1,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          fontWeight: 600
        }}
      >
        {title}
      </DialogTitle>

      <DialogContent sx={{ mt: 3 }}>
        {children}
      </DialogContent>

      {actions && (
        <DialogActions sx={{ p: 3, pt: 2, gap: 1 }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}

export default BaseDialog;