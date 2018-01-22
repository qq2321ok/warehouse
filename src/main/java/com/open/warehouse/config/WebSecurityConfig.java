package com.open.warehouse.config;

import com.open.warehouse.config.securitybean.User;
import com.open.warehouse.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.web.filter.CharacterEncodingFilter;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.List;

/**
 * Created by wujw on 17/11/1.
 */
@EnableWebSecurity
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    DataSource dataSource;

    @Autowired
    MyUser myUser;

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(myUser).passwordEncoder(new BCryptPasswordEncoder()).and()
            .jdbcAuthentication()
            .dataSource(dataSource);
//                .withUser("admin").password(new BCryptPasswordEncoder().encode("123456")).roles("ADMIN");
    }
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //添加转码
        CharacterEncodingFilter encodingFilter = new CharacterEncodingFilter();
        encodingFilter.setEncoding("UTF-8");
        encodingFilter.setForceEncoding(true);
        http.addFilterBefore(encodingFilter, CsrfFilter.class);
        http
            .authorizeRequests()
            .antMatchers("/resources/**","/app/view/**","/assets/**","/example/**").permitAll()
            .antMatchers("/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
            .and()
            .formLogin()
            .loginPage("/app/view/login")
            //.successForwardUrl("/app/index")
            .successForwardUrl("/app/monitor/search")
            .permitAll();
    }

    @Bean
    public MyUser myUser(){
        MyUser myUser = new MyUser();
        return myUser;
    }

    @Autowired
    UserService userService;
    class MyUser implements UserDetailsService{
        public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
            User user = new User();
            List<HashMap<String,String>> users =  userService.findUserByName(s);
            if(users.size()<1){
                return null;
            }
            String[] auths = new String[users.size()];
            for(int i=0;i<users.size();i++){
                HashMap u=users.get(i);
                user.setPassword(u.get("password").toString());
                user.setUsername(u.get("username").toString());
                auths[i]=u.get("authority").toString();
                String id=u.get("id")+"";
                user.setId(Long.parseLong(id));
                user.setEnabled((Boolean)u.get("enabled"));
            }
            user.setAuthorities(AuthorityUtils.createAuthorityList(auths));
            return user;
        }
    }

}
