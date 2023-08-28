import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import 'react-native-url-polyfill/auto'
import Account from './components/Account'
import Auth from './components/Auth'
import { supabase } from './constants/Supabase'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <View>
      {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
    </View>
  )
}