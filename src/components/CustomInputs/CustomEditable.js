import {
  Box,
  Editable,
  EditableInput,
  EditablePreview,
} from '@chakra-ui/react';

export const CustomEditable = ({
  id,
  defaultValue,
  onChange,
  width,
  height,
  icon = false,
  pl = false,
  py = false,
  px = false,
  ml = false,
  borderColor = 'stroke',
}) => {
  return (
    <Editable
      id={id}
      defaultValue={defaultValue}
      onChange={onChange}
      border={'1px'}
      borderColor={borderColor}
      borderRadius={'10px'}
      focusBorderColor={'transparent'}
      maxW={width}
      position={'relative'}
      {...(ml && { ml })}
    >
      {icon && (
        <Box position='absolute' top={'15px'} left={'10px'}>
          {icon}
        </Box>
      )}
      <EditablePreview
        w={width}
        h={height}
        textStyle='center'
        verticalAlign={'center'}
        display={'flex'}
        alignItems={'center'}
        {...(pl && { pl })}
        {...(py && { py })}
        {...(px && { px })}
        margin='0'
      />
      <EditableInput
        w={width}
        h={height}
        textStyle='center'
        _focus={{ boxShadow: 'none' }}
        {...(pl && { pl })}
        {...(py && { py })}
        {...(px && { px })}
        margin='0'
      />
    </Editable>
  );
};
