// React套件
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'

// MUI套件
import { Alert, Box, Button, Container, Snackbar, TextField, Typography } from '@mui/material'

// 外部套件
import * as Yup from 'yup'
import { Formik } from 'formik'

// 自定義套件
import { AppContext } from '../Context'

const Login = () => {
    const navigate = useNavigate()
    const { userLogin, setIsAuthenticated } = useContext(AppContext)
    const [errorMessage, setErrorMessage] = useState('')

    return (
        <>
            <Helmet>
                <title>Login | AOI</title>
            </Helmet>
            <Box
                sx={{
                    backgroundColor: '#F0E7DD',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'center',
                }}
            >
                <Container maxWidth='sm'>
                    <Formik
                        initialValues={{
                            empId: '',
                            password: '',
                        }}
                        validationSchema={Yup.object().shape({
                            empId: Yup.string().max(6).required('請輸入工號'),
                            password: Yup.string().max(255).required('請輸入密碼'),
                        })}
                        onSubmit={async (values, { setSubmitting }) => {
                            try {
                                await userLogin(values)
                                localStorage.setItem('loginCredentials', JSON.stringify(values))
                                setIsAuthenticated(true)
                                const from = location.state?.from?.pathname || '/app/airesults'
                                navigate(from, { replace: true }) // 登入後首頁
                            } catch (err) {
                                setErrorMessage('登入失敗，請檢查您的帳號及密碼是否正確。')
                                setSubmitting(false)
                            }
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue }) => {
                            useEffect(() => {
                                const savedCredentials = JSON.parse(localStorage.getItem('loginCredentials') || '{}')
                                if (savedCredentials.empId) {
                                    setFieldValue('empId', savedCredentials.empId)
                                    setFieldValue('password', savedCredentials.password)
                                }
                            }, [setFieldValue])

                            return (
                                <form onSubmit={handleSubmit}>
                                    <Box>
                                        <Typography align='center' color='#000000' variant='h1'>
                                            2/O AOI 資訊平台
                                        </Typography>
                                        <Typography align='center' color='#E8664B' gutterBottom variant='body1'>
                                            歡迎登入
                                        </Typography>
                                    </Box>
                                    <TextField
                                        error={Boolean(touched.empId && errors.empId)}
                                        fullWidth
                                        helperText={touched.empId && errors.empId}
                                        label='帳號'
                                        margin='normal'
                                        name='empId'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type='text'
                                        value={values.empId}
                                        variant='outlined'
                                    />
                                    <TextField
                                        error={Boolean(touched.password && errors.password)}
                                        fullWidth
                                        helperText={touched.password && errors.password}
                                        label='密碼'
                                        margin='normal'
                                        name='password'
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        type='password'
                                        value={values.password}
                                        variant='outlined'
                                    />
                                    {/* <Box sx={{ py: 2, display: 'flex', justifyContent: 'space-between' }}>
                                        <Button
                                            color='primary'
                                            disabled={isSubmitting}
                                            fullWidth
                                            size='large'
                                            onClick={async () => {
                                                try {
                                                    await userADLogin()
                                                    navigate('/app/airesults', { replace: true })
                                                } catch (err) {
                                                    setErrorMessage('AD 登入失敗，請稍後再試。')
                                                }
                                            }}
                                            variant='contained'
                                        >
                                            AD整合驗證
                                        </Button> */}
                                    <Box sx={{ mx: 1 }} />
                                    <Button
                                        color='primary'
                                        disabled={isSubmitting}
                                        fullWidth
                                        size='large'
                                        type='submit'
                                        variant='contained'
                                    >
                                        登入
                                    </Button>
                                    {/* </Box> */}
                                </form>
                            )
                        }}
                    </Formik>
                    <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
                        <Alert onClose={() => setErrorMessage('')} severity="error" sx={{ width: '100%' }}>
                            {errorMessage}
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </>
    )
}

export default Login
