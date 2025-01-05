import { Card, CardContent, Typography } from "@mui/material";



export interface IViewUser {
    name: string;
    age: number;
}

export const User = (props: IViewUser) => {
    const cardContent = (
        <CardContent>
            <Typography sx={{ fontSize: 18 }}>
                {props.name}
            </Typography>
            <Typography sx={{ fontSize: 18 }}>
                {props.age}
            </Typography>
        </CardContent>
    )

    return (
        <Card sx={{ maxWidth: '96%', height: '200px' }}>
            {cardContent}
        </Card>
    )

}
