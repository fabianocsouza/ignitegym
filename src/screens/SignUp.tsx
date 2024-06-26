import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { Center, Heading, Image, ScrollView, Text, VStack, useToast } from "native-base";

import { api } from "@services/api";

import LogoSvg from "@assets/logo.svg";
import BackgroundImg from "@assets/background.png";

import { Input }from "@components/Input";
import { Button } from "@components/Button";

import { AppError } from "@utils/AppError";
import { useState } from "react";
import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail.').email('Email inválido.'),
  password:yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password')], 'A confirmação da senha não confere.')
});

export function SignUp() {
  const  [isLoading, setIsLoading] = useState(false);

  const toast = useToast();
  const { signIn } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  async function handleSignUp( { name, email, password }: FormDataProps ) {

    try {
      setIsLoading(true);
      await api.post('/users', { name, email, password });
      await signIn(email, password);
    } catch (error) {
      
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível criar a conta .Tente novamente mais tarde.'; 

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    }finally{
      setIsLoading(false);
    }
     
  }

  return (
    <ScrollView contentContainerStyle={{flex: 1}}
      showsVerticalScrollIndicator={false}
     >
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt='Pessoas treinando'
          resizeMode='contain'
          position='absolute'
        />

        <Center my={24}>
          <LogoSvg/>
          <Text color='gray.100' fontSize='sm'>
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center mt={20}>
          <Heading color='gray.100' fontSize='xl' mb={6} fontFamily='heading'>
           Crie sua conta
          </Heading>
     
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } } ) => (
              <Input 
                placeholder='Nome'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } } ) => (
              <Input 
                placeholder='E-mail'
                onChangeText={onChange}
                value={value}
                keyboardType='email-address'  
                errorMessage={errors.email?.message}  
              />
            )}
          />
         
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } } ) => (
              <Input 
                placeholder='Senha'
                onChangeText={onChange}
                value={value}
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } } ) => (
              <Input 
                placeholder='Confirma a senha'
                onChangeText={onChange}
                value={value}
                secureTextEntry
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <Button 
            title='Criar e acessar'
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

          <Button 
            mt={12}
            title='Voltar para o login' 
            variant="outline" 
            onPress={handleGoBack}
          />

      </VStack>
    </ScrollView>
  )
}