import { Add, Upload } from "@mui/icons-material";
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material";
import { useState } from "react";
import AddSequenceDialog from "./add-sequence-dialog";
import FileUploadDialog from "./file-upload-dialog";


export default function ActionsSpeedDial() {
  let [showAddSequenceDialog, setShowSequenceDialog] = useState(false);
  let [showFileUploadDialog, setShowFileUploadDialog] = useState(false);

  const actions = [
    { icon: <Upload />, name: 'Upload file', onClick: () => setShowFileUploadDialog(true) },
    { icon: <Add />, name: 'Add sequence', onClick: () => setShowSequenceDialog(true) },
  ];

  return (
    <>
      <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
        <SpeedDial
          direction="left"
          ariaLabel="SpeedDial basic example"
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              onClick={action.onClick}
              slotProps={{ tooltip: { title: action.name } }}
            />
          ))}
        </SpeedDial>
      </Box>
      <AddSequenceDialog open={showAddSequenceDialog} handleClose={() => setShowSequenceDialog(false)} />
      <FileUploadDialog open={showFileUploadDialog} handleClose={() => setShowFileUploadDialog(false)} />
    </>
  );
}

