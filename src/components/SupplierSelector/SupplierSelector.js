import React, {useState} from 'react';
import FormControl from "@material-ui/core/FormControl";
import {FormHelperText, InputLabel, Select} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import {makeStyles} from "@material-ui/core/styles";
import {useMount} from "ahooks";
import {fetchSupplierList} from "../../lib/request/supplier";


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 220,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    menuItem: {
        display: 'block',
        padding: theme.spacing(1),
        borderBottom: '1px solid #ccc'
    },
    wrapper: {

    }
}))
export const SupplierSelector = (props) => {
    const classes = useStyles();
    const [value, setValue] = useState(props.defaultValue);
    const [dataSource, setDataSource] = useState([]);

    const handleChange = (event) => {
        setValue(Number(event.target.value));
        props.onChange?.(event.target.value);
    };
    useMount(() => {
        fetchSupplierList({
            current: 1,
            size: 9999
        }).then((res = {}) => {
            setDataSource(res.data || [])

        })
    })
    return <div>
        <FormControl className={classes.formControl}>
            <InputLabel id="simple-select-supplier">关联供应商</InputLabel>
            <Select
                labelId="simple-select-supplier"
                id="simple-select-supplier"
                value={value ? value : ''}
                className={classes.wrapper}
                options={dataSource}
                defaultValue={props.defaultValue}
                onChange={handleChange}
            >
                <MenuItem value="" className={classes.menuItem}>
                    <em>None</em>
                </MenuItem>
                {
                    dataSource.map(item => {
                        return <MenuItem className={classes.menuItem}
                                         name={item.name}
                                         key={item.id}
                                         value={item.id}>{item.name}</MenuItem>

                    })
                }
            </Select>
            {props.required && !value && <FormHelperText style={{color: '#e73630'}}>此项必填</FormHelperText> }
        </FormControl>
    </div>
}
