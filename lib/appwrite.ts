import { CreateUserParams, SignInParams } from "@/types";
import { Account, Avatars, Client, ID, Query, TablesDB } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!
}

export const client = new Client();
client.setEndpoint(appwriteConfig.endpoint!).setProject(appwriteConfig.projectId!).setPlatform(appwriteConfig.platform!)

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
const avatars = new Avatars(client);

export const createUser = async ({email, password, name}: CreateUserParams) =>{
    try {
        const newAcoount = await account.create({userId:ID.unique(), email, password, name});

        if (!newAcoount) throw Error;
        await signIn({email, password});

        const avatarUrl = avatars.getInitialsURL(name);
        return await tablesDB.createRow({
            databaseId:appwriteConfig.databaseId,
            tableId: appwriteConfig.userCollectionId,
            rowId:ID.unique(),
            data:{accountId: newAcoount.$id, email, name, avatar: avatarUrl}
            }
            
        );
    } catch (e) {
        throw new Error(e as string)
    }
}

export const signIn = async ({email, password}: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession({email, password});

    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;
        const currentUser = await tablesDB.listRows(
            {
                databaseId: appwriteConfig.databaseId,
                tableId: appwriteConfig.userCollectionId,
                queries: [Query.equal('accountId', currentAccount.$id)]
                
            }
        )

        if (!currentAccount) throw Error;
        return currentUser.rows[0];
    } catch (e) {
        throw new Error(e as string)
    }
}