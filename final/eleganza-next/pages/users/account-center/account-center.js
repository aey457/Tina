import { useState, useEffect } from 'react'
import Head from 'next/head'
import styles from './account-center.module.css'
import UserLayout from '@/component/users/user-layout'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'

export default function AccountCenter() {
  const [userDetails, setUserDetails] = useState(null) // 初始化為 null，因為在開始時還沒有使用者詳細資訊

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/home-myaccount/${userId}`,
      )
      if (!response.ok) throw new Error('Failed to fetch user details')
      const data = await response.json()
      setUserDetails(data.userDetails)
    } catch (error) {
      console.error('Error fetching user details:', error)
      // 在這裡處理錯誤，例如顯示一個錯誤提示給用戶
    }
  }

  const { auth, updateProfile } = useAuth()
  const [user, setUser] = useState({
    user_email: '',
    user_password: '',
    user_phone: '',
    user_name: '',
    user_account: '',
    newPassword: '',
    newPasswordConfirm: '',
  })
  const [errors, setErrors] = useState({
    user_useremail: '',
    user_password: '',
    user_phone: '',
    user_name: '',
    user_account: '',
    newPassword: '',
    newPasswordConfirm: '',
  })

  useEffect(() => {
    const userId = user?.id // 或者任何你想要的使用者ID
    if (userId) {
      fetchUserDetails(userId)
    }
  }, [user?.id])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) return

        const parseJwt = (token) => {
          const base64Payload = token.split('.')[1]
          const payload = Buffer.from(base64Payload, 'base64')
          return JSON.parse(payload.toString())
        }

        const userData = parseJwt(accessToken)
        setUser(userData)

        const response = await fetch(
          `http://localhost:3005/api/home-myaccount/${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        if (!response.ok) throw new Error('Failed to fetch user details')
        const data = await response.json()
        setUser(data.user)
        // console.log(userData)
      } catch (error) {
        console.error('Error fetching user details:', error)
        // 在這裡處理錯誤，例如顯示一個錯誤提示給用戶
      }
    }

    fetchUserData()
  }, [])

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    let hasErrors = false
    const { user_password, newPassword, newPasswordConfirm } = user
    const newErrors = { password: '', newPassword: '', newPasswordConfirm: '' }

    // 驗證密碼

    setErrors(newErrors)

    if (hasErrors) return

    updateProfile(user)
  }

  return (
    <>
      <div className={styles['main']}>
        <div className={styles['mainarea-desktop']}>
          <div>
            <form onSubmit={handleSubmit}>
              <p className={styles['maintitle']}>帳號細節</p>
              <div className={styles['formdetail']}>
                <div className={styles['formkey']}>
                  <p>帳號名稱</p>
                  <p>手機號碼</p>
                </div>
                <div className={styles['formvalue']}>
                  <p>{userDetails?.user_email}</p>
                  <p>{userDetails?.user_phone}</p>
                </div>
              </div>
              <div>
                <p className={styles['maintitle']}>個人檔案</p>
                <div className={styles['formdetail']}>
                  <div className={styles['formkey']}>
                    <p>姓名</p>
                    <p>手機號碼</p>
                    <p>顯示名稱</p>
                  </div>
                  <div className={styles['formvalue']}>
                    <input
                      className={styles['formstyle']}
                      type="text"
                      // placeholder={user?.user_name}
                      name="name"
                      value={user?.user_name}
                      onChange={handleFieldChange}
                    />
                    <input
                      className={styles['formstyle']}
                      type="text"
                      // placeholder={userDetails?.user_phone}
                      name="phone"
                      value={user?.user_phone}
                      onChange={handleFieldChange}
                    />
                    <input
                      className={styles['formstyle']}
                      type="text"
                      // placeholder={userDetails?.user_account}
                      name="account"
                      value={user?.user_account}
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className={styles['maintitle']}>變更密碼</p>
                <div className={styles['formdetail']}>
                  <div className={styles['formkey']}>
                    <p>舊密碼</p>
                    <p>新密碼</p>
                    <p>密碼確認</p>
                  </div>
                  <div className={styles['formvalue']}>
                    <input
                      className={styles['formstyle']}
                      type="password"
                      placeholder="舊密碼"
                      name="password"
                      value={user?.user_password}
                      onChange={handleFieldChange}
                    />
                    <input
                      className={styles['formstyle']}
                      type="password"
                      placeholder="不可與舊密碼相同"
                      name="newPassword"
                      value={user?.new_Password}
                      onChange={handleFieldChange}
                    />
                    <input
                      className={styles['formstyle']}
                      type="password"
                      placeholder="確認新密碼"
                      name="newPasswordConfirm"
                      value={user?.new_PasswordConfirm}
                      onChange={handleFieldChange}
                    />
                    <div className={styles['xsbtn']}>
                      <button
                        type="submit"
                        //onClick={(e) => updateProfile(e, user)}
                      >
                        儲存
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className={styles['mainarea-mobile']}>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                marginBottom: 20,
                width: '100%',
                borderBottom: '0.5px solid var(--color-primary-medium)',
              }}
            >
              <p>{userDetails?.user_account}</p>
            </div>
            <p className={styles['maintitle']}>帳號細節</p>
            <div className={styles['formdetail']}>
              <div className={styles['formkey']}>
                <p>帳號名稱</p>
                <p>手機號碼</p>
              </div>
              <div className={styles['formvalue']}>
                <p>{userDetails?.user_email}</p>
                <p>{userDetails?.user_phone}</p>
              </div>
            </div>
            <p className={styles['maintitle']}>個人檔案</p>
            <div className={styles['formdetail']}>
              <div className={styles['formkey']}>
                <p>姓名</p>
                <p>手機號碼</p>
                <p>顯示名稱</p>
              </div>
              <div className={styles['formvalue']}>
                <input
                  className={styles['formstyle']}
                  type="text"
                  // placeholder={userDetails?.user_name}
                  name="name"
                  value={user?.user_name}
                  onChange={handleFieldChange}
                />
                <input
                  className={styles['formstyle']}
                  type="text"
                  // placeholder={userDetails?.user_phone}
                  name="phone"
                  value={user?.user_phone}
                  onChange={handleFieldChange}
                />
                <input
                  className={styles['formstyle']}
                  type="text"
                  // placeholder={userDetails?.user_account}
                  name="account"
                  value={user?.user_account}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            <p className={styles['maintitle']}>變更密碼</p>
            <div className={styles['formdetail']}>
              <div className={styles['formkey']}>
                <p>舊密碼</p>
                <p>新密碼</p>
                <p>密碼確認</p>
              </div>
              <div className={styles['formvalue']}>
                <input
                  className={styles['formstyle']}
                  type="password"
                  placeholder="舊密碼"
                  name="password"
                  value={user?.user_password}
                  onChange={handleFieldChange}
                />
                <input
                  className={styles['formstyle']}
                  type="password"
                  placeholder="新密碼"
                  name="newPassword"
                  value={user?.newPassword}
                  onChange={handleFieldChange}
                />
                <input
                  className={styles['formstyle']}
                  type="password"
                  placeholder="確認密碼"
                  name="newPasswordConfirm"
                  value={user?.newPasswordConfirm}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            <div className={styles['xsbtn']}>
              <button
                type="submit"
                //onClick={(e) => updateProfile(e, user)}
              >
                儲存
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

AccountCenter.getLayout = function (page) {
  return <UserLayout currentPage="我的帳號">{page}</UserLayout>
}
