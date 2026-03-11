import { Add, MoreVert, Upload } from "@mui/icons-material";
import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import AddSequenceDialog from "./add-sequence-dialog";
import FileUploadDialog from "./file-upload-dialog";

export default function AddSequenceDropdown() {
  const [showAddSequenceDialog, setShowSequenceDialog] = useState(false);
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddSequence = () => {
    setShowSequenceDialog(true);
    handleClose();
  };

  const handleUploadFile = () => {
    setShowFileUploadDialog(true);
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleClick}
        endIcon={<MoreVert />}
        aria-controls={open ? "actions-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        Add Sequence
      </Button>
      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "actions-button",
          },
        }}
      >
        <MenuItem onClick={handleAddSequence}>
          <ListItemIcon>
            <Add fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add sequence</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleUploadFile}>
          <ListItemIcon>
            <Upload fontSize="small" />
          </ListItemIcon>
          <ListItemText>Upload file</ListItemText>
        </MenuItem>
      </Menu>
      <AddSequenceDialog
        open={showAddSequenceDialog}
        handleClose={() => setShowSequenceDialog(false)}
      />
      <FileUploadDialog
        open={showFileUploadDialog}
        handleClose={() => setShowFileUploadDialog(false)}
      />
    </>
  );
}
