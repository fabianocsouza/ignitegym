import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Controller, useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { Center, Heading, Image, ScrollView, Text, VStack } from "native-base";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import LogoSvg from "@assets/logo.svg";
import BackgroundImg from "@assets/background.png";

import { Input }from "@components/Input";
import { Button } from "@components/Button";

type FormDataSignInProps = {
  email: string;
  password: string;
}

const signInSchema = yup.object({
  email: yup.string().required('Informe o e-mail.').email('Email inválido.'),
  password: yup.string().required('Informe a senha.')
})

export function SignIn() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataSignInProps>({
    resolver: yupResolver(signInSchema)
  });

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleNewAccount() {
    navigation.navigate('signUp')
  }

  function handleSignIn(data: FormDataSignInProps) {
    console.log(data);
    
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

        <Center mt={32}>
          <Heading color='gray.100' fontSize='xl' mb={6} fontFamily='heading'>
            Acesse sua conta
          </Heading>
     
          <Controller
            control={control}
            name='email'
            render={({ field: {onChange, value} }) => (
              <Input 
                placeholder='E-mail'
                keyboardType='email-address'
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />
          
          <Controller
            control={control}
            name='password'
            render={({field: { onChange, value } }) => (
              <Input
                placeholder='Senha'
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />
          
          <Button 
            title='Acessar'
            onPress={handleSubmit(handleSignIn)}
          />
        </Center>

        <Center mt={24}>
          <Text
            color='gray.100'
            fontSize='sm'
            fontFamily='body'
            mb={3}
          >
            Ainda não tem acesso?
          </Text>
          <Button 
            title='Criar conta' 
            variant="outline" 
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}