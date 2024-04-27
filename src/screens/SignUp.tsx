import { Center, Heading, Image, ScrollView, Text, VStack } from "native-base";

import LogoSvg from "@assets/logo.svg";
import BackgroundImg from "@assets/background.png";

import { Input }from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";

export function SignUp() {

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
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
     
          <Input 
            placeholder='Nome'
          />

          <Input 
            placeholder='E-mail'
            keyboardType='email-address'
          />

          <Input
            placeholder='Senha'
            secureTextEntry
          />

          <Button title='Criar e acessar'/>
        </Center>

          <Button 
            mt={24}
            title='Voltar para o login' 
            variant="outline" 
            onPress={handleGoBack}
          />

      </VStack>
    </ScrollView>
  )
}