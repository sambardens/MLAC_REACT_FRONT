import {
  Box, Flex, Heading, IconButton, Text,
} from '@chakra-ui/react';

import { nanoid } from '@reduxjs/toolkit';
import { useState } from 'react';

import CustomInput from '@/components/CustomInputs/CustomInput';
import CustomTextarea from '@/components/CustomInputs/CustomTextarea';
import UploadImage from '@/components/UploadMedia/UploadImage';

import PlusIcon from '@/assets/icons/base/plus.svg';
import UrlIcon from '@/assets/icons/base/url.svg';

import MenuTitle from '../MenuTitle/MenuTitle';

const PressMenu = () => {
  const [blog, setBlog] = useState('');
  const [socialLinks, setSocialLinks] = useState([{ id: nanoid(), link: '' }]);
  const [videoSrc, setVideoSrc] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const handleChangeBlog = (e) => {
    setBlog(e.target.value);
  };

  const handleVideo = (e) => {
    setVideoSrc(e.target.value);
  };

  const handleChangeSocialLinks = (e, checkedIndex) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => prev.map((el, i) => (i === checkedIndex ? { ...el, [name]: value } : el)));
  };

  const handleAddSocialLink = () => {
    setSocialLinks((prev) => [...prev, { id: nanoid(), link: '' }]);
  };

  return (
    <Flex flexDir={'column'} justifyContent='space-between' h='100%'>
      <Box maxW='600px'>
        <MenuTitle
          title='Press/RP'
          text='Share information about your release with your listeners'
        />
        <CustomTextarea
          label='Pitch to blog'
          placeholder='Enter text...'
          name='blog'
          value={blog}
          onChange={handleChangeBlog}
          onBlur={() => {}}
          mb='32px'
        />
        <Box mb='32px'>
          <Heading
            as='h4'
            fontSize='18px'
            fontWeight='600'
            color='black'
            lineHeight='1.5'
            mb='8px'
          >
						Social media
          </Heading>
          <Text
            fontSize='14px' fontWeight='400' color='secondary'
            mb='16px'>
						Spotify, Facebook, Twitter etc.
          </Text>
          <Flex as='ul' flexDir='column' gap='16px'>
            {socialLinks.map((el, i) => (
              <CustomInput
                key={el.id}
                icon={UrlIcon}
                iconColor='accent'
                placeholder='Enter link'
                value={socialLinks[i].link}
                name='link'
                onChange={(e) => {
                  handleChangeSocialLinks(e, i);
                }}
              />
            ))}
          </Flex>

          <Box textAlign='end' mt='16px'>
            <IconButton
              borderRadius='10px'
              aria-label='Add field for enter social link'
              icon={<PlusIcon />}
              color='accent'
              bg='bg.secondary'
              _hover={{ bg: 'stroke' }}
              transition='0.3s linear'
              onClick={handleAddSocialLink}
            />
          </Box>
        </Box>
        <Box mb='32px'>
          <Heading
            as='h4'
            fontSize='18px'
            fontWeight='600'
            color='black'
            lineHeight='1.5'
            mb='16px'
          >
						Add video
          </Heading>
          <CustomInput
            label='Upload from YouTube'
            icon={UrlIcon}
            iconColor='accent'
            placeholder='Enter link'
            value={videoSrc}
            name='youtubeLink'
            onChange={handleVideo}
          />
          <Text
            fontSize='16px'
            fontWeight='600'
            color='black'
            align='center'
            my='16px'
          >
						or
          </Text>
          <UploadImage
            // setVideoSrc={setVideo}
            // setVideoFile={setVideoFile}
            title='Upload video	mp4, WMV'
            w='100%'
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default PressMenu;
