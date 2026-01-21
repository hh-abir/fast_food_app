import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { createUser } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignUp = () => {
    const [isSubmitting, setisSubmitting] = useState(false);
    const [form, setform] = useState({name: '', email: '', password: ''})
    const submit = async () => {
        const {name, email, password} = form;
        if (!name || !email || !password) Alert.alert("Error", "Please enter a valid email address or password");
        setisSubmitting(true);

        try {
            // Call Appwrite SignIn
            await createUser({
                email,
                password,
                name
            });
            router.replace("/")
        }catch(error: any) {
            Alert.alert("Error", error.message)
        } finally {{
            setisSubmitting(false);
        }}
    }
  return (
    <View className='gap-10 bg-white rounded-lg p-5 mt-5'>
        <CustomInput 
            placeholder='Enter you full name'
            value={form.name}
            onChangeText={(text)=> setform((prev) => ({...prev, name: text}))}
            label='Full name'
            keyboardType='email-address'
        />
     <CustomInput 
            placeholder='Enter you email'
            value={form.email}
            onChangeText={(text)=> setform((prev) => ({...prev, email: text}))}
            label='Email'
            keyboardType='email-address'
        />
        <CustomInput 
            placeholder='Enter you password'
            value={form.password}
            onChangeText={(text)=> setform((prev) => ({...prev, password: text}))}
            label='Password'
            secureTextEntry={true}
        />
        
        <CustomButton title='Sign Up' isLoading={isSubmitting} onPress={submit} />
        <View className='flex justify-center mt-5 flex-row gap-2'>
            <Text className='base-regular text-gray-100'>
            Already have an account?
            </Text>
            <Link href={"/sign-in"} className='base-bold text-primary'>
            Sign In
            
            </Link>
        </View>
    </View>
  )
}

export default SignUp