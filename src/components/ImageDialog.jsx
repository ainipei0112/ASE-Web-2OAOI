// React套件
import { useContext, useEffect, useState } from 'react'

// MUI套件
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Grid,
    Pagination,
    IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

// 自定義套件
// import { AppContext } from '../Context.jsx'
import Actions from '../Actions'

const ImageDialog = ({ open, onClose, lot, date, id }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [photosPerPage] = useState(8)
    const [photos, setPhotos] = useState([])
    // const { getImageFiles } = useContext(AppContext)
    const { getImageFiles } = Actions();

    // 切頁
    const handlePageChange = (event, page) => {
        setCurrentPage(page)
    }

    // 取得照片
    useEffect(() => {
        if (open && lot && date && id) {
            const loadPhotos = async () => {
                try {
                    const files = await getImageFiles(lot, date, id)
                    setPhotos(files)
                } catch (error) {
                    console.error('載入照片失敗:', error)
                }
            }
            loadPhotos()
        }
    }, [open, lot, date, id])
    const totalPages = Math.ceil(photos.length / photosPerPage)
    const currentPhotos = photos.slice((currentPage - 1) * photosPerPage, currentPage * photosPerPage)

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
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
                                component="img"
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
                            <Typography variant="body2" align="center">
                                {photo.displayName}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
                {totalPages > 1 && (
                    <Box mt={2} display="flex" justifyContent="center">
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ImageDialog