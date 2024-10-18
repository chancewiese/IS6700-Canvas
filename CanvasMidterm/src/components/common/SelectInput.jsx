import styled from "styled-components";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useTheme } from "../../context/ThemeContext";

const StyledFormControl = styled(FormControl)`
   && {
      margin-bottom: ${(props) => props.theme.spacing.medium};
      min-width: 120px;
      width: 100%;

      .MuiInputLabel-root {
         color: ${(props) => props.theme.colors.text};
      }

      .MuiOutlinedInput-root {
         background-color: ${(props) => props.theme.colors.white};

         &:hover .MuiOutlinedInput-notchedOutline {
            border-color: ${(props) => props.theme.colors.primary};
         }
         &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: ${(props) => props.theme.colors.primary};
         }
      }

      .MuiSelect-icon {
         color: ${(props) => props.theme.colors.text};
      }
   }
`;

const SelectInput = ({ label, value, onChange, options = [], ...props }) => {
   const { theme } = useTheme();

   return (
      <StyledFormControl theme={theme}>
         <InputLabel>{label}</InputLabel>
         <Select value={value} onChange={onChange} label={label} {...props}>
            {options && options.length > 0 ? (
               options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                     {option.label}
                  </MenuItem>
               ))
            ) : (
               <MenuItem disabled>No options available</MenuItem>
            )}
         </Select>
      </StyledFormControl>
   );
};

export default SelectInput;
