create database seed_one;
use seed_one;
drop table orders;

create table `orders` (
`cust_id` INT unsigned not null auto_increment primary key,
`name` VARCHAR(30) not null,
`telephone` VARCHAR(20),
`email` varchar(30),
`address_id` varchar(255) not null,
`date_ordered` datetime default current_timestamp, 
`delivery_date` DATE not null ,
`cucumber` INT(2),
`tomato` INT(2),
`squash` INT(2),
`jalapeno` INT(2),
`avacados` INT(2),
`greenpepper` INT(2),
`greenbeans` INT(2),
`asparagus` INT(2)
);


select * from orders;

