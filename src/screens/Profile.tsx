import * as yup from "yup"
import { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { yupResolver } from "@hookform/resolvers/yup"
import { Center, Heading, ScrollView, Skeleton, Text, VStack, useToast } from 'native-base';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { Controller, useForm } from 'react-hook-form';

const PHOTO_SIZE = 33;

type FormDataProfileProps = {
  name: string;
  password: string;
  password_new: string;
  password_confirm: string;
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  password: yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_new: yup.string().required('Informe nova senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.').notOneOf([yup.ref('password')], 'Nova senha deve ser diferente da senha antiga'),
  password_confirm: yup.string().required('Confirme a nova senha.').oneOf([yup.ref('password_new')], 'A confirmação da senha não confere.')
})

export  function Profile() {
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState('https://github.com/fabianocsouza.png');

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProfileProps>({
    resolver: yupResolver(profileSchema)
  });

  const toast = useToast();

  async function handleUserPhotoSelect(){
    setPhotoIsLoading(true)
   try {
    const photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      aspect: [4,4],
      allowsEditing: true,
    });

    if(photoSelected.canceled){
      return;
    }

    if(photoSelected.assets[0].uri){
      const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

      if(photoInfo.exists && (photoInfo.size / 1024/ 1024) > 5 ){
        
       return toast.show({
        title: "Essa imagem é muito grande. Escolha uma de até 5MB.",
        placement: "top",
        bgColor: "red.500"
       })
      }
      
      setUserPhoto(photoSelected.assets[0].uri);
    }
    
   } catch (error) {
    console.log(error);
    
   }finally{
    setPhotoIsLoading(false);
   }
  }

  function handleUpdate(data: FormDataProfileProps){
    console.log(data);
    
  }

  return (
    <VStack flex={1}>
      <ScrollView
      _contentContainerStyle={{pb: 9}}
      >
        <ScreenHeader title="Perfil"/>
        <Center mt={6} px={10}>
          {
            photoIsLoading
            ? <Skeleton
                w={PHOTO_SIZE} 
                h={PHOTO_SIZE} 
                rounded="full" 
                startColor="gray.500"
                endColor="gray.400"
              />
            : <UserPhoto
              source={{uri : userPhoto}}
              alt="Imagem do usuário"
              size={PHOTO_SIZE}
              mr={4}
            />
          }

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name='name'
            render={({field: { onChange, value }})=>(
              <Input
                bg="gray.600"
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Input
            bg="gray.600"
            placeholder="E-mail"
            isDisabled
          />

          <Heading color="gray.200" 
          fontSize="md" mb={2} 
          alignSelf="flex-start" mt={12}
          fontFamily="heading"
          >
            alterar senha
          </Heading>

          <Controller
            control={control}
            name='password'
            render={({field: { onChange, value }})=>(
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name='password_new'
            render={({field: { onChange, value }})=>(
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password_new?.message}
              />
            )}
          />

          <Controller
            control={control}
            name='password_confirm'
            render={({field: { onChange, value }})=>(
              <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <Button 
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handleUpdate)}
          />
        </Center>
      </ScrollView>
     </VStack>
  );
}
