import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import styled from 'styled-components';
import { Button, Loader } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import additionalProducts from 'testData/additionalProducts';
import { loadAllProducts } from 'slices';
import { ProductCard } from 'shared/components';
import { randomIdGenerator } from 'utils';

import { FilterForm } from './components';
import {
  StyledLeftSection, StyledRightSection, StyledBrowsePageHolder, StyledProductCardHolder,
  StyledButtonHolder, StyledLoaderHolder, StyledNoProductText,
} from './browseProductsPage.styles';

const BrowseProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProducts = useSelector((state) => state.userProducts);
  const allProducts = useSelector((state) => state.allProducts);
  const [showLoader, setShowLoader] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(loadAllProducts([...additionalProducts, ...userProducts]));
    setFilteredProducts([...additionalProducts, ...userProducts]);
  }, []);

  const loadButtonOnClickHandler = () => {
    setShowLoader(true);
    setTimeout(() => {
      toast.error('Request timed out!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("SERVER ERROR: Request timeout!");
    }, 5000)
  }

  const filterProducts = (data) => {
    // Bug fix!
    // let updatedFilteredProducts = [...additionalProducts, ...userProducts];
    let updatedFilteredProducts = filteredProducts;

    if (data.category) {
      updatedFilteredProducts = updatedFilteredProducts.filter(fp => fp.categories.map(p => p.name).includes(data.category));
    }

    if (data.is_buy_filter_turned_on) {
      updatedFilteredProducts = updatedFilteredProducts.filter(fp => fp.purchase_price > data.min_buy_range && fp.purchase_price < data.max_buy_range);
    }

    if (data.is_rent_filter_turned_on) {
      updatedFilteredProducts = updatedFilteredProducts.filter(fp => fp.rent_price >= data.min_rent_range && fp.rent_price <= data.max_rent_range);
    }

    setFilteredProducts(updatedFilteredProducts);
  }

  const resetFilteredProducts = () => {
    setFilteredProducts([...additionalProducts, ...userProducts]);
  }

  return(
    <StyledBrowsePageHolder>
      <StyledLeftSection>
        <FilterForm onSubmitHandler={filterProducts} resetFilteredProducts={resetFilteredProducts} />
      </StyledLeftSection>
      <StyledRightSection>
        { filteredProducts.length === 0 ?
          <StyledNoProductText>
            No products to display
          </StyledNoProductText> :
          filteredProducts.map(product =>
            <StyledProductCardHolder key={randomIdGenerator()}>
              <ProductCard
                product={product}
                onClick={() => navigate(`/edit-product/${product.id}`)}
              />
            </StyledProductCardHolder>
          )
        }
        {
          showLoader &&
          <StyledLoaderHolder>
            <Loader size='large' inline active>
              Loading
            </Loader>
          </StyledLoaderHolder>
        }
        { filteredProducts.length > 0 &&
          <StyledButtonHolder>
            <Button color='blue' onClick={loadButtonOnClickHandler}>Load More</Button>
          </StyledButtonHolder>
        }
      </StyledRightSection>
    </StyledBrowsePageHolder>
  );
};

export default BrowseProductsPage;