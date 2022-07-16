import styledC from '@emotion/styled';
import TextField from '@mui/material/TextField';
import {styled} from '@mui/material/styles';
import React from 'react';

const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: '#1976d2',
    },
    '& label': {
        color: '#e8e8e8',
      },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'red',
    },
    '& .MuiOutlinedInput-input':{
      color: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#133e6f',
      },
      '&:hover fieldset': {
        borderColor: '#1976d2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1976d2',
      },
      '&.Mui-focused label': {
        borderColor: '#1976d2',
      },
    },
  });

const InputContainer = styledC.div`
    margin: 10px 0;
    display:flex;
`

const InputText: React.FC<{handleFilter: React.ChangeEventHandler<HTMLInputElement>}> = ({handleFilter}) => {
    return ( 
        <InputContainer>
            <CssTextField label="Search pokemon" id="custom-css-outlined-input" onChange={handleFilter}/>
        </InputContainer>
     );
}
 
export default InputText;