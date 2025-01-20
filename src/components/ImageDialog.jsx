// React套件
import { useEffect, useReducer, useRef } from 'react'

// MUI套件
import { Box, Dialog, DialogTitle, DialogContent, Grid, IconButton, Pagination, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

// 自定義套件
import Actions from '../Actions'

const initialState = {
    currentPage: 1,
    photos: [],
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_PHOTOS':
            return { ...state, photos: action.payload }
        case 'SET_PAGE':
            return { ...state, currentPage: action.payload }
        case 'RESET_PAGE':
            return { ...state, currentPage: 1 }
        default:
            return state
    }
}

const ImageDialog = ({ open, onClose, lot, date, id }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { currentPage, photos } = state
    const { getImageFiles } = Actions()

    // 使用 ref 來保存最新的 props 值
    const propsRef = useRef({ lot, date, id, getImageFiles })

    // 更新 ref 的值
    useEffect(() => {
        propsRef.current = { lot, date, id, getImageFiles }
    })

    // 切頁
    const handlePageChange = (event, page) => {
        dispatch({ type: 'SET_PAGE', payload: page })
    }

    // 取得照片並重置頁碼
    useEffect(() => {
        const { lot: currentLot, date: currentDate, id: currentId } = propsRef.current

        if (open && currentLot && currentDate && currentId) {
            const loadPhotos = async () => {
                try {
                    const { getImageFiles } = propsRef.current
                    const files = await getImageFiles(currentLot, currentDate, currentId)
                    dispatch({ type: 'SET_PHOTOS', payload: files })
                } catch (error) {
                    console.error('載入照片失敗:', error)
                }
            }
            loadPhotos()
            dispatch({ type: 'RESET_PAGE' })
        }
    }, [open, date, lot, id])

    const photosPerPage = 8
    const totalPages = Math.ceil(photos.length / photosPerPage)
    const currentPhotos = photos.slice((currentPage - 1) * photosPerPage, currentPage * photosPerPage)

    return (
        <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
            <DialogTitle>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    {`${date} - ${lot} - ${id}`}
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    {currentPhotos.map((photo, index) => (
                        <Grid item xs={6} md={3} key={index}>
                            <Box
                                component='img'
                                src={photo.fullPath}
                                alt={photo.displayName}
                                sx={{
                                    width: '100%',
                                    height: 200,
                                    objectFit: 'contain',
                                }}
                                onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = 'http://wbaoi.kh.asegroup.com/Image/Error/Error.png'
                                }}
                            />
                            <Typography variant='body2' align='center'>
                                {photo.displayName}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
                {totalPages > 1 && (
                    <Box mt={2} display='flex' justifyContent='center'>
                        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ImageDialog
