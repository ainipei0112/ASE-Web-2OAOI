import { useState } from 'react';
import { Button, Tooltip, Box, LinearProgress } from '@mui/material';

const DownloadButton = ({ fileSize, exportToExcel }) => {
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);

    const handleDownload = async () => {
        setStatus('downloading');
        setProgress(0);

        try {
            await exportToExcel((percentage) => {
                setProgress(Math.max(percentage, 5)); // 設置最小進度
            });
            setStatus('success');
        } catch (error) {
            setStatus('error');
            console.error('下載失敗:', error);
        }
    };

    const handleReset = () => {
        setStatus('idle');
        setProgress(0);
    };

    return (
        <Tooltip title={fileSize} arrow placement="left">
            <span>
                {status === 'idle' && (
                    <Button variant="contained" onClick={handleDownload}>
                        Export Excel
                    </Button>
                )}
                {status === 'downloading' && (
                    <Box>
                        <Button variant="contained" disabled>
                            努力下載中... {progress}%
                        </Button>
                        <LinearProgress variant="determinate" value={progress} />
                    </Box>
                )}
                {status === 'success' && (
                    <Button variant="contained" color="success" onClick={handleReset}>
                        <Box display="flex" alignItems="center">
                            <svg
                                fill="none"
                                stroke="currentColor"
                                width="24"
                                height="24"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ marginRight: '8px' }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7" // 勾勾
                                />
                            </svg>
                            下載完成
                        </Box>
                    </Button>
                )}
                {status === 'error' && (
                    <Button variant="contained" color="error" onClick={handleReset}>
                        <Box display="flex" alignItems="center">
                            <svg
                                fill="none"
                                stroke="currentColor"
                                width="24"
                                height="24"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ marginRight: '8px' }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12" // 叉叉
                                />
                            </svg>
                            下載失敗
                        </Box>
                    </Button>
                )}
            </span>
        </Tooltip>
    );
};

export default DownloadButton;
