import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
// import * as Yup from 'yup'
import { Formik } from 'formik'
import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { useContext } from 'react'
import { AppContext } from '../Context'

const Login = () => {
    const navigate = useNavigate()
    const { userLogin } = useContext(AppContext)

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
                            empId: 'Your empId',
                            password: '',
                        }}
                        // validationSchema={Yup.object().shape({
                        //     empId: Yup.string().max(5).required('Empid is required'),
                        //     password: Yup.string().max(255).required('Password is required'),
                        // })}
                        onSubmit={(value) => {
                            navigate('/app/chart', { replace: true }) // 登入後首頁
                            userLogin(value)
                        }}
                    >
                        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
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
                                    value={values.Empid}
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
                                <Box sx={{ py: 2, display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        color='primary'
                                        disabled={isSubmitting}
                                        fullWidth
                                        size='large'
                                        type='submit'
                                        variant='contained'
                                    >
                                        AD整合驗證
                                    </Button>
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
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Container>
            </Box>
        </>
    )
}

export default Login
